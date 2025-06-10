import 'package:cc_mobile/models/stats_model.dart';
import 'package:cc_mobile/repository/stats_repository.dart';

class MockStatsRepository implements StatsRepositoryInterface {
  @override
  Future<StatsModel> fetchStats() async {
    // Simula una respuesta exitosa con datos ficticios
    await Future.delayed(Duration(seconds: 1)); // Simula un retraso de red

    return StatsModel(
      numberEvents: 1000,
      numberUsers: 250,
      numberExpenses: 5000,

    );
  }
}