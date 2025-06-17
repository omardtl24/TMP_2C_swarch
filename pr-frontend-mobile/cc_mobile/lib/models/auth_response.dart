class AuthResponse<T> {
  final String status;
  final T? data;
  final String? message;

  AuthResponse.success(this.data) 
    : status = 'success',
      message = null;

  AuthResponse.error(this.message) 
    : status = 'error',
      data = null;

  bool get isSuccess => status == 'success';
  bool get isError => status == 'error';
}
