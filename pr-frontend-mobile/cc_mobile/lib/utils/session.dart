
import 'package:flutter/foundation.dart';
import '../models/user_model.dart';
import '../utils/secure_storage.dart';

class Session extends ChangeNotifier {
  UserModel? _user;
  String? _jwt;

  UserModel? get user => _user;
  String? get jwt => _jwt;

  bool get isAuthenticated => _jwt != null && _user != null;

  void updateSession({required UserModel user, required String jwt}) {
    _user = user;
    _jwt = jwt;
    notifyListeners();
  }

  Future<void> loadSession() async {
    final jwt = await SecureStorage.instance.read(key: 'jwt');
    if (jwt != null) {
      _jwt = jwt;
    }
    notifyListeners();
  }

  Future<void> logout() async {
    _user = null;
    _jwt = null;
    await SecureStorage.instance.delete(key: 'jwt');
    notifyListeners();
  }
}
