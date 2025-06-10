import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cc_mobile/models/stats_model.dart';
import 'package:cc_mobile/services/stats_service.dart';
import 'package:cc_mobile/repository/stats_repository.dart';
import 'package:cc_mobile/mock/mock_stats_repository.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MaterialApp(
        title: 'cc_mobile',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: const Color.fromARGB(255, 126, 34, 255)),
        ),
        home: StatsPage(),
      ),
    );
  }
}

class MyAppState extends ChangeNotifier {
  
}

// ...


class StatsPage extends StatefulWidget {
  const StatsPage({super.key});

  @override
  State<StatsPage> createState() => _StatsPageState();
}

class _StatsPageState extends State<StatsPage> {
  late Future<StatsModel> futureStats;

  @override
  void initState() {
    super.initState();

    // Aquí se instancia todo con baseUrl
    final service = StatsService(baseUrl: 'https://api.midominio.com');
    final repository = MockStatsRepository();
    // final repository = StatsRepository(service: service);

    futureStats = repository.fetchStats();
    
  }

  @override
  Widget build(BuildContext context) {
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
      margin: const EdgeInsets.all(16.0),
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
          ),)
      ),
    );
  }
}



// class MyHomePage extends StatefulWidget {
//   @override
//   State<MyHomePage> createState() => _MyHomePageState();
// }




// class _MyHomePageState extends State<MyHomePage> {
//   var selectedIndex = 0;
//   @override
//   Widget build(BuildContext context) {
//     Widget page;
//     switch (selectedIndex) {
//       case 0:
//         page = GeneratorPage();
//         break;
//       case 1:
//         page = FavoritePage();
//         break;
//       default:
//         throw UnimplementedError('no widget for $selectedIndex');
//     }
//     return LayoutBuilder(
//       builder: (context,constraints) {
//         return Scaffold(
//           body: Row(
//             children: [
//               SafeArea(
//                 child: NavigationRail(
//                   extended: constraints.maxWidth >= 600,  // ← Here.
//                   destinations: [
//                     NavigationRailDestination(
//                       icon: Icon(Icons.home),
//                       label: Text('Home'),
//                     ),
//                     NavigationRailDestination(
//                       icon: Icon(Icons.favorite),
//                       label: Text('Favorites'),
//                     ),
//                   ],
//                   selectedIndex: selectedIndex,
//                   onDestinationSelected: (value) {
//                     setState(() {
//                       selectedIndex = value;
//                     });
//                   },
//                 ),
//               ),
//               Expanded(
//                 child: Container(
//                   color: Theme.of(context).colorScheme.primaryContainer,
//                   child: page,
//                 ),
//               ),
//             ],
//           ),
//         );
//       }
//     );
//   }
// }




// // ...

// class BigCard extends StatelessWidget {
//   const BigCard({super.key, required this.pair});

//   final WordPair pair;

//   @override
//   Widget build(BuildContext context) {
//     final theme = Theme.of(context);
//     final style = theme.textTheme.displayMedium!.copyWith(
//       color: theme.colorScheme.onPrimary,
//     );

//     return Card(
//       color: theme.colorScheme.primary,
//       elevation: 10,
//       margin: const EdgeInsets.all(20.0),
//       shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
//       child: Padding(
//         padding: const EdgeInsets.all(20.0),
//         child: Text(
//           pair.asLowerCase,
//           style: style,
//           semanticsLabel: "${pair.first} ${pair.second}",
//         ),
//       ),
//     );
//   }
// }
