## Açıklama

## Dosya düzeni
- **src/main.ts** Uygulamanın **giriş dosyası** (entry point)
- **src/configuration** burada uygulama ile ilgili bazı konfigurasyon dosyaları mevcuttur. Örneğin veritabanı için gerekli olan bilgiler.
- **src/decorators** burada endpoint fonksiyonlarına eklemek üzere dekoratörler bulunmaktadır. Ne yaptıkları dosya dosya açıklanmıştır.
- **src/guards** burada bazı guardlar mevcuttur. Örneğin kullanıcının giriş yapmasının mecburi olduğu aksiyonlarda AuthRequired kullanılmaktadır.
- **src/interceptors** burada interceptor (middleware) dosyaları bulunmaktadır. rxjs/operators paketi sayesinde request yaşam döngüsünün istediğimiz her yerine middleware ekleyebiliriz.
- **src/models** burada veritabanı modellerimiz bulunmaktadır
    - **model-adi.model.ts** modelin kendisi
    - **model-adi.hooks.ts** modele CRUD uygularken çalışacak fonksiyonlar
    - **model-adi.virtuals.ts** modelin diğer modellerle olan ilişkilerinin belirtildiği dosya
    - **model-adi.enums.ts** model için enumlar
    - **model-adi.methods.ts** modelin metodları
    - **model-adi.subdoc.ts** alt dökümanların bulunduğu dosya
- **src/modules** burada uygulamanın controller dosyaları bulunmaktadır
    - **modül-adi.controller.ts** Controller dosyasının kendisi
    - **modül-adi.service.ts** Controller için servis dosyası
    - **modül-adi.module.ts** Dependency injection'ları belirtmek için kullanılan mudül dosyası
    - **dto/dto-adi.dto.ts** Request body için kontrolleri sağlayacak olan classlar. Orn. maksimum uzunluk 32 minimum uzunluk 2 olacak.
- **src/utils** uygulama ile ilgili bazı kısayol fonksiyonlarının bulunduğu dosya

## Gerekli bağımlılıkları kurmak için

```bash
$ yarn install
```

## Uygulamayı çalıştırmak için

```bash
# development
$ yarn start

# watch mode (hot reload)
$ yarn start:dev

# production mode
$ yarn start:prod
```