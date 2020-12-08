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

  /**
   *  @summary KAYIT OL
   *  @statusCodes 200, 400 */
  @ApiOperation({
    summary: 'Kayıt ol',
    description: 'Kayıt olmak için kullanılan endpoint',
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

  /**
   * 	@summary GİRİŞ YAP
   *  @description verilen kriterlere göre kullanıcı girişi
   *  @statusCodes 200, 401, 400 */
  @ApiOperation({
    summary: 'Giriş yap',
    description: 'Giriş yapmak için kullanılan endpoint',
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
        'you must specify either username or email',
      );

    const user = await this.$authService.get({
      username: body.username,
      email: body.email,
    });

    if (!user)
      throw new UnauthorizedException(
        'email, username or password is not correct',
      );

    if (!(await user.comparePasswords(body.password, user.password)))
      throw new UnauthorizedException(
        'email, username or password is not correct',
      );

    return this.createToken(user, res);
  }

  /**
   *  @summary ÇIKIŞ YAP
   * 	@description Cookie'lerde bulunan jwt anahtar kelimesini kaldırır
   *  @statusCodes 200 */
  @ApiOperation({
    summary: 'Çıkış yap',
    description: 'Çıkış yapmak için kullanılan endpoint',
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

  /**
   *  @description Kullanıcının şifresini günceller
   *  @permissions authenticated users
   *  @statusCodes 200, 401, 400 */
  @ApiOperation({
    summary: 'Şifreyi güncelle',
    description: 'Şifreyi güncellemek için kullanılan endpoint',
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
    return { status: 'success' }; // TODO: Güzel döndür
  }

  /**
   *  @description Kullanıcının eposta adresini günceller ve doğrulama epostası gönderir
   *  @permissions authenticated users
   *  @statusCodes 200, 401, 400 */
  @ApiOperation({ summary: 'E-posta adresi güncelle' })
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

  /**
   *  @description Kullanıcının diğer alanlarını günceller
   *  @permissions authenticated users
   *  @statusCodes 200, 401, 400 */
  @ApiOperation({ summary: 'Bilgileri güncelle' })
  @ApiOkResponse({
    description: 'Bilgileri güncellemek için kullanılan endpoint',
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

  /**
   *  @description Şu anki kullanıcıyı döner
   *  @permissions authenticated users
   *  @statusCodes 200 */
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

  /**
   * @description jwt token oluşturur ve token ile user'ı return eder
   */
  private async createToken(user: UserDocument, res: Response) {
    const token = await generateJWTToken(
      user.id,
      this.$configService.get('JWT_SECRET_KEY'),
      this.$configService.get('JWT_EXPIRES_IN'),
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
