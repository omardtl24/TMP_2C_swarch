import "dart:convert";
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;


class AuthService {
  Future<Map<String, dynamic>> authenticateInBackend(String code) async {
    final response = await http.get(
      Uri.parse('${dotenv.env['API_GATEWAY']}auth/google/callback?code=${code}'),
      headers: {'Content-Type': 'application/json'},
      
    );

    final responseJson = jsonDecode(response.body);
    if (response.statusCode == 200) {
      final data= responseJson['data'];
      return data;
    } else {
      throw Exception('Error en autenticación: ${responseJson['message']}');
    }
  }
}
