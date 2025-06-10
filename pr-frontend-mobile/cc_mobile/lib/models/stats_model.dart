class StatsModel {
  final int numberEvents;
  final int numberUsers;
  final int numberExpenses;


  const StatsModel({
    required this.numberEvents,
    required this.numberUsers,
    required this.numberExpenses,

  });

  factory StatsModel.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {'numberEvents':int numberEvents, 'numberUsers':int numberUsers, 'numberExpenses':int numberExpenses} => StatsModel(
        numberEvents: numberEvents,
        numberUsers: numberUsers,
        numberExpenses: numberExpenses,
      ),
      _ => throw const FormatException('Failed to load album.'),
    };
  }
}

