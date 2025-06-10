import 'package:cc_mobile/models/stats_model.dart';
import 'package:cc_mobile/services/stats_service.dart';
import 'package:flutter/material.dart';

abstract class StatsRepositoryInterface {
  Future<StatsModel> fetchStats();
}

class StatsRepository implements StatsRepositoryInterface {
  final StatsService service;


  StatsRepository({required this.service});
  @override
  Future<StatsModel> fetchStats() async {
    try {
      final json = await service.getStats();
      final stats = StatsModel.fromJson(json);
      return stats;
    } catch (e) {
      debugPrint('Error al obtener stats desde red: $e');
      throw Exception('No se pudo obtener stats ni desde red ni desde cache.');
    }
  }
}
