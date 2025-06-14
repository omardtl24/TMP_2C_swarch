import 'package:google_sign_in/google_sign_in.dart';
import '../models/user_model.dart';
import '../repository/google_auth_repository.dart';



class MockGoogleAuthRepository implements GoogleAuthRepositoryInterface {
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'openid'],
    serverClientId: '414832951377-d9t6vqebm0ov63njffrga981ooie637n.apps.googleusercontent.com',
  );


  MockGoogleAuthRepository();
      


  @override
  Future<UserModel?> signInWithGoogle() async {
    
    final account = await _googleSignIn.signIn();
    if (account == null) return null; // Usuario canceló
    final String? code = account.serverAuthCode;
 
  
    if (code == null) throw Exception('No se recibió serverAuthCode');
    print("CODEEEEEEEEEEEEEEEEEEE: $code");

 

    // 6) Crea o mapea tu UserModel
    return UserModel(
      id:    1,
      email: "juanda",
      name:  "juanda",
      username: "juanda",
      // cualquier otro campo...
    );
  }
  
  @override
  Future<void> clearRegisterToken() {
    // TODO: implement clearRegisterToken
    throw UnimplementedError();
  }
  
  @override
  Future<bool> hasRegisterToken() {
    // TODO: implement hasRegisterToken
    throw UnimplementedError();
  }
  
  @override
  Future<bool> registerUser({required String email, required String username}) {
    // TODO: implement registerUser
    throw UnimplementedError();
  }

  /// Decodifica el payload JWT para extraer claims
  // Map<String, dynamic> _parseIdToken(String idToken) {
  //   // Usa tu propia librería; aquí un ejemplo con jwt_decoder
  //   return JwtDecoder.decode(idToken);
  // }
}
