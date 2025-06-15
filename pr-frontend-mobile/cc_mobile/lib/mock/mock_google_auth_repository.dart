import 'package:google_sign_in/google_sign_in.dart';
import '../models/user_model.dart';
import '../repository/google_auth_repository.dart';
import '../models/response.dart'; // Updated import




class MockGoogleAuthRepository implements GoogleAuthRepositoryInterface {
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'openid'],
    serverClientId: '414832951377-d9t6vqebm0ov63njffrga981ooie637n.apps.googleusercontent.com',
  );


  MockGoogleAuthRepository();
      

  @override
  Future<Response<UserModel>> signInWithGoogle() async {
    

 

    // 6) Crea o mapea tu UserModel
    final user = UserModel(
      id:    1,
      email: "juanda",
      name:  "juanda",
      username: "juanda",
      // cualquier otro campo...
    );
    return Response<UserModel>.success(user);
  }
  
  
  @override
  Future<Response<void>> clearRegisterToken() async {
    // TODO: implement clearRegisterToken
    return Response<void>.success(null); // Mock response
  }
  
  @override
  Future<Response<bool>> hasRegisterToken() async {
    // TODO: implement hasRegisterToken
    return Response<bool>.success(true); // Mock response
  }
  
  @override
  Future<Response<bool>> registerUser({required String email, required String username}) async {
    // TODO: implement registerUser
    return Response<bool>.success(true); // Mock response
  }

  /// Decodifica el payload JWT para extraer claims
  // Map<String, dynamic> _parseIdToken(String idToken) {
  //   // Usa tu propia librería; aquí un ejemplo con jwt_decoder
  //   return JwtDecoder.decode(idToken);
  // }
}
