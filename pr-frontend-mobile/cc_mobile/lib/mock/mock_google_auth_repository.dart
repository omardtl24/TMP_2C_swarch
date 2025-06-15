import 'package:google_sign_in/google_sign_in.dart';
import '../models/user_model.dart';
import '../repository/google_auth_repository.dart';
import '../models/auth_response.dart'; // Make sure this import exists




class MockGoogleAuthRepository implements GoogleAuthRepositoryInterface {
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'openid'],
    serverClientId: '414832951377-d9t6vqebm0ov63njffrga981ooie637n.apps.googleusercontent.com',
  );


  MockGoogleAuthRepository();
      

  @override
  Future<AuthResponse<UserModel>> signInWithGoogle() async {
    

 

    // 6) Crea o mapea tu UserModel
    final user = UserModel(
      id:    1,
      email: "juanda",
      name:  "juanda",
      username: "juanda",
      // cualquier otro campo...
    );
    return AuthResponse<UserModel>.success(user);
  }
  
  
  @override
  Future<AuthResponse<void>> clearRegisterToken() async {
    // TODO: implement clearRegisterToken
    return AuthResponse<void>.success(null); // Mock response
  }
  
  @override
  Future<AuthResponse<bool>> hasRegisterToken() async {
    // TODO: implement hasRegisterToken
    return AuthResponse<bool>.success(true); // Mock response
  }
  
  @override
  Future<AuthResponse<bool>> registerUser({required String email, required String username}) async {
    // TODO: implement registerUser
    return AuthResponse<bool>.success(true); // Mock response
  }

  /// Decodifica el payload JWT para extraer claims
  // Map<String, dynamic> _parseIdToken(String idToken) {
  //   // Usa tu propia librería; aquí un ejemplo con jwt_decoder
  //   return JwtDecoder.decode(idToken);
  // }
}
