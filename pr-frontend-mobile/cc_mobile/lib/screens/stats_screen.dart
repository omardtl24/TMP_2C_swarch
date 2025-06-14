import 'package:cc_mobile/models/stats_model.dart';
import 'package:cc_mobile/services/stats_service.dart';
import 'package:cc_mobile/repository/stats_repository.dart';
import 'package:cc_mobile/mock/mock_stats_repository.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cc_mobile/utils/session.dart';

class StatsScreen extends StatefulWidget {
  const StatsScreen({super.key});

  @override
  State<StatsScreen> createState() => _StatsPageState();
}

class _StatsPageState extends State<StatsScreen> {
  late Future<StatsModel> futureStats;

  @override
  void initState() {
    super.initState();
    // Instanciar repositorio y servicio
    final service = StatsService();
    final repository = MockStatsRepository(); // O usa StatsRepository(service: service)
    futureStats = repository.fetchStats();
  }

  @override
  Widget build(BuildContext context) {
    // Leer sesión desde el provider para obtener el usuario
    final session = context.watch<Session>();
    final user = session.user;

    return Scaffold(
      appBar: AppBar(title: const Text('Estadísticas')),
      body: Padding(
        padding: const EdgeInsets.all(14.0),
        child: FutureBuilder<StatsModel>(
          future: futureStats,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            } else if (snapshot.hasData) {
              final stats = snapshot.data!;
              return Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Estadísticas de ${user?.name ?? 'Usuario'}',
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  StatsCard(statsValue: stats.numberEvents, statsLabel: 'Eventos'),
                  StatsCard(statsValue: stats.numberUsers, statsLabel: 'Usuarios'),
                  StatsCard(statsValue: stats.numberExpenses, statsLabel: 'Gastos'),
                ],
              );
            } else {
              return const Center(child: Text('No hay datos'));
            }
          },
        ),
      ),
    );
  }
}

class StatsCard extends StatelessWidget {
  final int statsValue;
  final String statsLabel;

  const StatsCard({super.key, required this.statsValue, required this.statsLabel});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(8.0),
      color: Theme.of(context).colorScheme.primaryContainer,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                statsLabel,
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              Text(
                statsValue.toString(),
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.deepPurple),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
