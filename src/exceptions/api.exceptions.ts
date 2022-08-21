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
    return this.NewException('Wrong login or password.');
  }

}

export default ApiExceptions;