class Response<T> {
  final String status;
  final T? data;
  final String? message;

  Response.success(this.data) 
    : status = 'success',
      message = null;

  Response.error(this.message) 
    : status = 'error',
      data = null;

  bool get isSuccess => status == 'success';
  bool get isError => status == 'error';
}
