class ApiExceptions {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  public static UserNotExist(): string {
    return this.NewException("Can't find a user with this data.");
  }

  public static UserAlreadyExist(): string {
    return this.NewException('User with this email or login already exist.');
  }

  public static WrongAuthData(): string {
    return this.NewException('Wrong email or login or password.');
  }

  public static UserIdNotExist(): string {
    return this.NewException('User with this id not exist.');
  }

  public static RoleAlreadyExit(): string {
    return this.NewException('Role with this value already exist.');
  }

  public static RoleValueEmpty(): string {
    return this.NewException("Can't find value in body.");
  }

  public static FileNotBase64(): string {
    return this.NewException('File is not base64.');
  }

  public static TooLargeFileSize(): string {
    return this.NewException('Too large file size. (max size is 5mb)');
  }

  public static FileNotFound(): string {
    return this.NewException('File not found.');
  }

  public static PostAlreadyExist(): string {
    return this.NewException('Post already exist.');
  }

  public static PostNotExist(): string {
    return this.NewException('Post not founded.');
  }

  public static CommentNotExist(): string {
    return this.NewException('Comment not founded.');
  }

  public static FileNotValid(): string {
    return this.NewException(
      'File size or file type is not valid. (file is a base64 string and max size its a 5 mb)',
    );
  }

  public static PostAlreadyLiked(): string {
    return this.NewException('Post already liked.');
  }

  private static NewException(message: string): string {
    return new ApiExceptions(message).message;
  }
}

export default ApiExceptions;
