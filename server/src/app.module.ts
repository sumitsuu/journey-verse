import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ArtModule } from "./art/art.module";
import { AuthModule } from "./auth/auth.module";
import { CountryModule } from "./country/country.module";
import { GenreModule } from "./genre/genre.module";
import { StatusModule } from "./status/status.module";
import { TypeModule } from "./type/type.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ArtModule,
    AuthModule,
    UserModule,
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, "..", "client"),
        serveRoot: "/static",
      },
      {
        rootPath: join(__dirname, "..", "client", "images", "users"),
        serveRoot: "/images/users",
      },
      {
        rootPath: join(__dirname, "..", "client", "images", "arts"),
        serveRoot: "/images/arts",
      }
    ),
    CountryModule,
    TypeModule,
    StatusModule,
    GenreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
