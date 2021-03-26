import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { AuthData } from './schemas/auth-data.schema';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { UpdateProfileRequestDto } from './dto/update-profile-request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(AuthData.name) private readonly authDataModel: Model<AuthData>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const newUser = new this.userModel(registerUserDto);
    const savedUser = await newUser.save();
    if (savedUser) {
      this.sendWelcomeMail(
        savedUser.email,
        'Welcome to Dev Snacks Corner',
        `${newUser.firstName} ${newUser.lastName}`,
      );
    }
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(email: string): Promise<User> {
    return this.userModel.findOne({ email }).populate('encryptedPassword');
  }

  async getEncryptedPassword(plaintextPassword: string): Promise<string> {
    return await bcrypt.hash(plaintextPassword, 10);
  }

  async verifyPassword(
    plaintextPassword: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plaintextPassword, encryptedPassword);
  }

  async createAuthData(encryptedPassword: string): Promise<AuthData> {
    const newAuthData = new this.authDataModel({ encryptedPassword });
    return newAuthData.save();
  }

  async getAccessToken(user: User): Promise<LoginResponseDto> {
    return {
      access_token: this.jwtService.sign({
        _id: user._id,
        email: user.email,
      }),
      user,
    };
  }

  async updateUserPassword(
    userId: string,
    encryptedPassword: string,
  ): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.BAD_REQUEST);
    }

    const authId = user.encryptedPassword;

    return this.authDataModel.updateOne(
      { _id: authId },
      { $set: { encryptedPassword } },
      { new: true },
    );
  }

  updateUserProfile(userId: string, updateProfileDto: UpdateProfileRequestDto) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateProfileDto },
      { new: true },
    );
  }

  sendWelcomeMail(recipient: string, subject: string, username: string): void {
    this.mailerService
      .sendMail({
        to: recipient,
        subject: subject,
        template: 'welcome', // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
        context: {
          username,
        },
      })
      .then(() => {
        console.log(`Email sent to ${recipient}`);
      })
      .catch(err => {
        console.log(`Email err for ${recipient}`, err);
      });
  }
}
