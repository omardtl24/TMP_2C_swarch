import "dart:convert";
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;


class AuthService {
  final String baseUrl= dotenv.env['API_GATEWAY_URL']!;


  Future<Map<String, dynamic>> authenticateInBackend(String code) async {
    final response = await http.get(
      Uri.parse('$baseUrl/auth/google/callback?code=${code}'),
      headers: {'Content-Type': 'application/json'},
      
    );

    final responseJson = jsonDecode(response.body);
    if (responseJson['status'] == 'success') {
      final data= responseJson['data'];
      print('DATAAAAAAA: $data');
      return data;
    } else {
      throw Exception('Error en autenticación: ${responseJson['message']}');
    }
  }
  Future<Map<String, dynamic>> registerUserInBackend({
    required String email,
    required String username,
    required String registerToken,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'register_token=$registerToken', // Aquí va como cookie
      },
      body: jsonEncode({
        'email': email,
        'username': username,
      }),
    );

    final responseJson = jsonDecode(response.body);
    print('Response del registro en el servicio: $responseJson');
    if (response.statusCode == 200 ) {
      return responseJson;
    } else {
      final error = responseJson['message'] ?? 'Error desconocido en el registro';
      throw Exception('Error al registrar usuario: $error');
    }
  }

}
