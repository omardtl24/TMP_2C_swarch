import 'dart:convert';
import 'package:http/http.dart' as http;

class StatsService {
  final String baseUrl;
  final http.Client client;

  StatsService({required this.baseUrl, http.Client? client})
      : client = client ?? http.Client();

  Future<Map<String, dynamic>> getStats() async {
    final response = await http.get(Uri.parse('$baseUrl/stats'));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Error al obtener stats');
    }
  }
}
