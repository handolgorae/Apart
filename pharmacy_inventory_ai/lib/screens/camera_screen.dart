import 'dart:io';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import '../services/gemini_service.dart';
import 'ocr_result_screen.dart';

class CameraScreen extends StatefulWidget {
  const CameraScreen({super.key});

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  CameraController? _ctrl;
  bool _ready = false;
  bool _busy = false;
  String? _errorMsg;

  @override
  void initState() {
    super.initState();
    _requestPermissionAndInit();
  }

  Future<void> _requestPermissionAndInit() async {
    final status = await Permission.camera.request();
    if (!mounted) return;
    if (status.isDenied || status.isPermanentlyDenied) {
      setState(() => _errorMsg = '카메라 권한이 필요합니다.\n설정에서 권한을 허용해주세요.');
      if (status.isPermanentlyDenied) openAppSettings();
      return;
    }
    await _initCamera();
  }

  Future<void> _initCamera() async {
    try {
      final cameras = await availableCameras();
      if (cameras.isEmpty) throw Exception('카메라를 찾을 수 없습니다.');
      final rear = cameras.firstWhere(
        (c) => c.lensDirection == CameraLensDirection.back,
        orElse: () => cameras.first,
      );
      _ctrl = CameraController(rear, ResolutionPreset.high, enableAudio: false);
      await _ctrl!.initialize();
      if (mounted) setState(() => _ready = true);
    } catch (e) {
      if (mounted) setState(() => _errorMsg = '카메라 오류: $e');
    }
  }

  Future<void> _shoot() async {
    if (_ctrl == null || !_ctrl!.value.isInitialized || _busy) return;
    setState(() => _busy = true);

    File? file;
    try {
      final xFile = await _ctrl!.takePicture();
      file = File(xFile.path);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('촬영 오류: $e')));
      }
      setState(() => _busy = false);
      return;
    }

    // Gemini AI 분석
    List<GeminiMedicineResult> results = [];
    try {
      results = await GeminiService.analyze(file);
    } catch (_) {
      // 실패 시 빈 리스트로 수동 입력
    }

    if (!mounted) return;
    setState(() => _busy = false);

    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => OcrResultScreen(
          imageFile: file!,
          geminiResults: results,
        ),
      ),
    );
  }

  @override
  void dispose() {
    _ctrl?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: const Text('약 사진 촬영'),
      ),
      body: _errorMsg != null
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Text(_errorMsg!,
                    textAlign: TextAlign.center,
                    style:
                        const TextStyle(color: Colors.white, fontSize: 16)),
              ),
            )
          : _ready
              ? Stack(
                  fit: StackFit.expand,
                  children: [
                    CameraPreview(_ctrl!),
                    if (_busy)
                      Container(
                        color: Colors.black54,
                        alignment: Alignment.center,
                        child: const Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            CircularProgressIndicator(color: Colors.white),
                            SizedBox(height: 16),
                            Text('AI 분석 중...',
                                style: TextStyle(
                                    color: Colors.white, fontSize: 16)),
                          ],
                        ),
                      ),
                  ],
                )
              : const Center(
                  child: CircularProgressIndicator(color: Colors.white)),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: _ready
          ? FloatingActionButton.large(
              onPressed: _busy ? null : _shoot,
              backgroundColor: Colors.white,
              child: const Icon(Icons.camera, color: Colors.black, size: 36),
            )
          : null,
    );
  }
}
