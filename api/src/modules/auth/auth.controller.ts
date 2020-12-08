import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Get,
  BadRequestException,
  Res,
  UnauthorizedException,
  NotImplementedException,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import * as moment from 'moment';
import { SignUpDTO } from './dto/sign-up.dto';
import { SignInDTO } from './dto/sign-in.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDocument } from '../../models/user-model/user.model';
import { filterObject } from '../../utils/filter-object';
import { generateJWTToken } from '../../utils/token';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Auth } from '../../decorators/auth.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateMeDto } from './dto/update-me.dto';

// TODO: Eposta güncellemek implemente edilecek...

@ApiTags('Kimlik Doğrulama')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly $authService: AuthService,
    private readonly $configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: 'Kayıt ol',
    description: 'Kayıt olmak için kullanılır',
  })
  @ApiCreatedResponse({ description: 'Başarılı' })
  @ApiBadRequestResponse({ description: 'Validasyon başarısız sonuçlanırsa' })
  @ApiConflictResponse({
    description: 'Herhangi eşsiz bir alan zaten kullanılıyorsa',
  })
  @Post('/sign-up')
  async signUp(
    @Body() body: SignUpDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.createToken(await this.$authService.create(body), res);
  }

  @ApiOperation({
    summary: 'Giriş yap',
    description: 'Giriş yapmak için kullanılır',
  })
  @ApiOkResponse({ description: 'Başarılı' })
  @ApiUnauthorizedResponse({
    description: 'Doğru olmayan bilgiler verildiğinde',
  })
  @ApiBadRequestResponse({ description: 'Validasyon başarısız sonuçlanırsa' })
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() body: SignInDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!body.username && !body.email)
      throw new BadRequestException(
        "ya 'username' ya da 'email' alanlarından biri bulunmalı",
      );

    const user = await this.$authService.get({
      username: body.username,
      email: body.email,
    });

    if (!user)
      throw new UnauthorizedException('email, username ya da password yanlış');

    if (!(await user.comparePasswords(body.password, user.password)))
      throw new UnauthorizedException('email, username ya da password yanlış');

    return this.createToken(user, res);
  }

  @ApiOperation({
    summary: 'Çıkış yap',
    description: 'Çıkış yapmak için kullanılır',
  })
  @ApiOkResponse({ description: 'Başarılı' })
  @Get('/sign-out')
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.cookie('jwt', 'signed-out', {
      httpOnly: true,
      expires: moment().add(15, 'seconds').toDate(),
    });

    return { status: 'success' };
  }

  @ApiOperation({
    summary: 'Şifreyi güncelle',
    description: 'Giriş yapmış olan kullanıcının şifresini günceller',
  })
  @ApiOkResponse({ description: 'Başarılı' })
  @ApiBadRequestResponse({ description: 'Validasyon başarısız sonuçlanırsa' })
  @Auth()
  @Put('/update-password')
  async updatePassword(
    @Body() body: UpdatePasswordDto,
    @CurrentUser() user: UserDocument,
  ) {
    if (body.newPassword !== body.newPasswordConfirm)
      throw new BadRequestException({
        message: ["field 'newPassword' and 'newPasswordConfirm' must be equal"],
      });

    if (!(await user.comparePasswords(body.currentPassword, user.password)))
      throw new BadRequestException({
        message: ["field 'currentPassword' must be true"],
      });

    user.password = body.newPassword;
    await user.save();
    return {};
  }

  // TODO: Eklenecek!!
  @ApiOperation({
    summary: 'E-posta adresi güncelle',
    description:
      'Giriş yapmış olan kullanıcının e-posta adresini günceller ve bir verifikasyon bağlantısı gönderir',
  })
  @ApiOkResponse({ description: "Başarılı. Doğrulama e-posta'sı gönderildi" })
  @ApiBadRequestResponse({ description: 'Validasyon başarısız sonuçlanırsa' })
  @ApiConflictResponse({
    description: 'Herhangi eşsiz bir alan zaten kullanılıyorsa',
  })
  @Auth()
  @Put('/update-email')
  async updateEmail() {
    throw new NotImplementedException();
  }

  @ApiOperation({
    summary: 'Bilgileri güncelle',
    description: 'Giriş yapmış olan kullanıcının bilgilerini günceller',
  })
  @ApiOkResponse({
    description: 'Başarılı',
  })
  @ApiBadRequestResponse({ description: 'Validasyon başarısız sonuçlanırsa' })
  @ApiConflictResponse({
    description: 'Herhangi eşsiz bir alan zaten kullanılıyorsa',
  })
  @Auth()
  @Put('/update-me')
  async updateMe(@Body() body: UpdateMeDto, @CurrentUser('id') id: string) {
    this.$authService.update(id, body);
  }

  @ApiOperation({
    summary: 'Şu anki kullanıcı',
    description: 'Şu anki kullanıcıyı döner',
  })
  @ApiOkResponse({ description: 'Başarılı' })
  @Auth()
  @Get('/current-user')
  async getCurrentUser(@CurrentUser() user: UserDocument) {
    filterObject(user, ['password', 'passwordChangedAt']);
    return user;
  }

  private async createToken(user: UserDocument, res: Response) {
    const token = await generateJWTToken(
      user.id,
      this.$configService.get<string>('JWT_SECRET_KEY'),
      this.$configService.get<string>('JWT_EXPIRES_IN'),
    );

    filterObject(user, ['password', 'passwordChangedAt']);

    res.cookie('jwt', token, {
      httpOnly: true,
      expires: moment()
        .add(3, 'months') // TODO: Tarihi Ayarla
        .toDate(),
    });

    return { token, user };
  }
}
