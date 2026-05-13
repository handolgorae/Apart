import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import '../models/medicine.dart';
import '../database/medicine_repository.dart';

class MedicineProvider extends ChangeNotifier {
  final _repo = MedicineRepository();
  final _uuid = const Uuid();

  List<Medicine> _all = [];
  String _searchQuery = '';
  String _sortBy = 'name'; // 'name' | 'shelf'

  List<Medicine> get medicines {
    var list = _all.where((m) {
      if (_searchQuery.isEmpty) return true;
      return m.name.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();

    if (_sortBy == 'shelf') {
      list.sort((a, b) => a.shelf.compareTo(b.shelf));
    } else {
      list.sort((a, b) => a.name.compareTo(b.name));
    }
    return list;
  }

  int get totalCount => _all.length;
  String get searchQuery => _searchQuery;
  String get sortBy => _sortBy;

  Future<void> init() async {
    _all = await _repo.getAll();
    notifyListeners();
  }

  void setSearch(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void setSortBy(String sort) {
    _sortBy = sort;
    notifyListeners();
  }

  Future<void> addFromOcr(List<String> names) async {
    final existing = _all.map((m) => m.name).toSet();
    final newMeds = names
        .where((n) => !existing.contains(n))
        .map((n) => Medicine(
              id: _uuid.v4(),
              name: n,
              createdAt: DateTime.now(),
            ))
        .toList();
    _all.addAll(newMeds);
    await _repo.insertAll(newMeds);
    notifyListeners();
  }

  Future<void> addFromGemini(List<Map<String, dynamic>> items) async {
    final existing = _all.map((m) => m.name).toSet();
    final newMeds = items
        .where((e) => !existing.contains(e['name']))
        .map((e) => Medicine(
              id: _uuid.v4(),
              name: e['name'] as String,
              quantity: e['quantity'] as int? ?? 0,
              createdAt: DateTime.now(),
            ))
        .toList();
    _all.addAll(newMeds);
    await _repo.insertAll(newMeds);
    notifyListeners();
  }

  Future<void> updateQuantity(String id, int qty) async {
    final idx = _all.indexWhere((m) => m.id == id);
    if (idx == -1) return;
    _all[idx] = _all[idx].copyWith(quantity: qty);
    await _repo.update(_all[idx]);
    notifyListeners();
  }

  Future<void> updateShelf(String id, String shelf) async {
    final idx = _all.indexWhere((m) => m.id == id);
    if (idx == -1) return;
    _all[idx] = _all[idx].copyWith(shelf: shelf);
    await _repo.update(_all[idx]);
    notifyListeners();
  }

  Future<void> updateName(String id, String name) async {
    final idx = _all.indexWhere((m) => m.id == id);
    if (idx == -1) return;
    _all[idx] = _all[idx].copyWith(name: name);
    await _repo.update(_all[idx]);
    notifyListeners();
  }

  Future<void> delete(String id) async {
    _all.removeWhere((m) => m.id == id);
    await _repo.delete(id);
    notifyListeners();
  }

  String exportText() {
    final now = DateTime.now().toString().substring(0, 10);
    final lines = medicines.map((m) {
      final loc = m.shelf.isEmpty ? '위치미정' : m.shelf;
      return '${m.name} - ${m.quantity}개 - $loc';
    }).join('\n');
    return '=== 약국 재고 목록 ===\n날짜: $now\n\n$lines';
  }
}
