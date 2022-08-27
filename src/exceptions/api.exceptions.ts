class ApiExceptions {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  private static NewException(message: string): string {
    return new ApiExceptions(message).message;
  }

  public static UserNotExist(): string {
    return this.NewException('Can\'t find a user with this email or username.');
  }

  public static UserAlreadyExist(): string {
    return this.NewException('User with this email or username already exist.');
  }

  public static WrongAuthData(): string {
    return this.NewException('Wrong email or username or password.');
  }

  public static UserIdNotExist(): string {
    return this.NewException('User with this id not exist.');
  }

  public static RoleAlreadyExit(): string {
    return this.NewException('Role with this value already exist.');
  }

  public static RoleValueEmpty(): string {
    return this.NewException('Can\'t find value in body.');
  }

  public static AvatarNotBase64(): string {
    return this.NewException('Avatar is not base64.');
  }

  public static TooLargeAvatarSize(): string {
    return this.NewException('Too large avatar size.');
  }

  public static FileNotFound(): string {
    return this.NewException('File not found.');
  }
}

export default ApiExceptions;