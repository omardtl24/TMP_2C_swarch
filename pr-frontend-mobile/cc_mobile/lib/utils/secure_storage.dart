import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorage {
  static final FlutterSecureStorage _instance = FlutterSecureStorage();
  static FlutterSecureStorage get instance => _instance;
}
