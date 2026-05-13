import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/medicine_provider.dart';
import '../services/share_service.dart';
import '../widgets/medicine_card.dart';
import '../widgets/search_bar_widget.dart';
import 'camera_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('약국 재고관리'),
        actions: [
          // 정렬
          Consumer<MedicineProvider>(
            builder: (_, p, __) => PopupMenuButton<String>(
              icon: const Icon(Icons.sort),
              tooltip: '정렬',
              onSelected: p.setSortBy,
              itemBuilder: (_) => [
                CheckedPopupMenuItem(
                    value: 'name',
                    checked: p.sortBy == 'name',
                    child: const Text('이름순')),
                CheckedPopupMenuItem(
                    value: 'shelf',
                    checked: p.sortBy == 'shelf',
                    child: const Text('약장순')),
              ],
            ),
          ),
          // 공유
          Consumer<MedicineProvider>(
            builder: (_, p, __) => IconButton(
              icon: const Icon(Icons.share),
              tooltip: '목록 공유',
              onPressed: () => ShareService.shareInventory(p.exportText()),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          const SearchBarWidget(),
          // 총 약품 수 표시
          Consumer<MedicineProvider>(
            builder: (_, p, __) => Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 4),
              child: Row(
                children: [
                  Text(
                    '총 ${p.totalCount}종',
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                  if (p.searchQuery.isNotEmpty) ...[
                    const Text(' · ', style: TextStyle(color: Colors.grey)),
                    Text(
                      '검색결과 ${p.medicines.length}종',
                      style: const TextStyle(
                          fontSize: 12, color: Color(0xFF1565C0)),
                    ),
                  ],
                ],
              ),
            ),
          ),
          // 목록
          Expanded(
            child: Consumer<MedicineProvider>(
              builder: (_, p, __) {
                final list = p.medicines;
                if (list.isEmpty) {
                  return _EmptyState(hasSearch: p.searchQuery.isNotEmpty);
                }
                return ListView.builder(
                  padding: const EdgeInsets.only(bottom: 90),
                  itemCount: list.length,
                  itemBuilder: (_, i) => MedicineCard(medicine: list[i]),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const CameraScreen()),
        ),
        icon: const Icon(Icons.camera_alt),
        label: const Text('사진 촬영'),
        backgroundColor: const Color(0xFF1565C0),
        foregroundColor: Colors.white,
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final bool hasSearch;
  const _EmptyState({required this.hasSearch});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            hasSearch ? Icons.search_off : Icons.medication_outlined,
            size: 64,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 12),
          Text(
            hasSearch
                ? '검색 결과가 없습니다.'
                : '등록된 약품이 없습니다.\n아래 버튼으로 사진을 촬영하세요.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }
}
