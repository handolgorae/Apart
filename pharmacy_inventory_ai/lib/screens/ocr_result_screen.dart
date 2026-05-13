import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/medicine_provider.dart';

class OcrResultScreen extends StatefulWidget {
  final File imageFile;
  final List<String> ocrNames;

  const OcrResultScreen({
    super.key,
    required this.imageFile,
    required this.ocrNames,
  });

  @override
  State<OcrResultScreen> createState() => _OcrResultScreenState();
}

class _OcrResultScreenState extends State<OcrResultScreen> {
  late List<String> _all;
  late Set<String> _selected;
  final _customCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _all = List.from(widget.ocrNames);
    _selected = Set.from(widget.ocrNames);
  }

  @override
  void dispose() {
    _customCtrl.dispose();
    super.dispose();
  }

  void _addCustom() {
    final name = _customCtrl.text.trim();
    if (name.isEmpty) return;
    setState(() {
      _all.add(name);
      _selected.add(name);
      _customCtrl.clear();
    });
  }

  Future<void> _save() async {
    if (_selected.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('추가할 약품을 하나 이상 선택하세요.')),
      );
      return;
    }
    await context.read<MedicineProvider>().addFromOcr(_selected.toList());
    if (!mounted) return;
    Navigator.popUntil(context, (r) => r.isFirst);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('${_selected.length}개 약품이 추가되었습니다.')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('OCR 결과 확인'),
        actions: [
          TextButton(
            onPressed: _save,
            child: const Text('저장',
                style: TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: Column(
        children: [
          // 촬영 이미지 미리보기
          SizedBox(
            height: 180,
            width: double.infinity,
            child: Image.file(widget.imageFile, fit: BoxFit.cover),
          ),

          // 직접 입력 영역
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _customCtrl,
                    decoration: const InputDecoration(
                      hintText: '약품명 직접 입력',
                      border: OutlineInputBorder(),
                      contentPadding:
                          EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      isDense: true,
                    ),
                    onSubmitted: (_) => _addCustom(),
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton(
                    onPressed: _addCustom, child: const Text('추가')),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 4),
            child: Row(
              children: [
                Text(
                  '인식된 텍스트 — ${_selected.length}개 선택됨',
                  style: const TextStyle(
                      fontWeight: FontWeight.w600, fontSize: 13),
                ),
              ],
            ),
          ),

          const Divider(height: 1),

          // OCR 결과 리스트
          Expanded(
            child: _all.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.text_fields,
                            size: 48, color: Colors.grey[400]),
                        const SizedBox(height: 8),
                        Text(
                          '인식된 텍스트가 없습니다.\n위에서 직접 입력해 주세요.',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey[600]),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    itemCount: _all.length,
                    itemBuilder: (_, i) {
                      final name = _all[i];
                      return CheckboxListTile(
                        title: Text(name),
                        value: _selected.contains(name),
                        onChanged: (v) => setState(() {
                          if (v == true) {
                            _selected.add(name);
                          } else {
                            _selected.remove(name);
                          }
                        }),
                        controlAffinity: ListTileControlAffinity.leading,
                        dense: true,
                      );
                    },
                  ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: FilledButton(
            onPressed: _save,
            style: FilledButton.styleFrom(
              minimumSize: const Size.fromHeight(48),
              backgroundColor: const Color(0xFF1565C0),
            ),
            child: Text('${_selected.length}개 약품 목록에 추가'),
          ),
        ),
      ),
    );
  }
}
