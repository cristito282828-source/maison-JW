#!/usr/bin/env python3
"""
Tracker de Tiempo de Desarrollo - Pinneacle Perfumería
Mide el tiempo real de ejecución de tareas y estima tiempos del usuario
"""

import time
from datetime import datetime, timedelta
from typing import Dict, List
import json

class TimeTracker:
    def __init__(self):
        self.tasks: List[Dict] = []
        self.current_start = None
        self.session_start = datetime.now()

    def start_task(self, task_name: str, category: str):
        """Iniciar una tarea"""
        self.current_start = time.time()
        print(f"\n⏱️  INICIO: {task_name}")
        print(f"📅 Timestamp: {datetime.now().strftime('%H:%M:%S')}")
        return {
            'task': task_name,
            'category': category,
            'start': datetime.now().isoformat(),
            'start_timestamp': time.time()
        }

    def end_task(self, task_data: Dict):
        """Finalizar una tarea"""
        end_time = time.time()
        duration = end_time - task_data['start_timestamp']

        task_data['end'] = datetime.now().isoformat()
        task_data['duration_seconds'] = round(duration, 2)
        task_data['duration_formatted'] = self.format_duration(duration)

        self.tasks.append(task_data)

        print(f"✅ FIN: {task_data['task']}")
        print(f"⏱️  Duración: {task_data['duration_formatted']}")
        print(f"📊 Timestamp: {datetime.now().strftime('%H:%M:%S')}")
        print(f"-" * 50)

        return task_data

    def format_duration(self, seconds: float) -> str:
        """Formatear duración en formato legible"""
        if seconds < 60:
            return f"{seconds:.1f} segundos"
        elif seconds < 3600:
            minutes = seconds / 60
            return f"{minutes:.1f} minutos"
        else:
            hours = seconds / 3600
            return f"{hours:.1f} horas"

    def estimate_user_review_time(self, complexity: str) -> float:
        """
        Estimar tiempo de revisión del usuario
        Basado en complejidad de la tarea
        """
        estimation_rules = {
            'simple': 30,       # 30 segundos para cambios simples
            'moderate': 90,     # 1.5 minutos para cambios moderados
            'complex': 180,     # 3 minutos para cambios complejos
            'very_complex': 300 # 5 minutos para cambios muy complejos
        }

        base_time = estimation_rules.get(complexity, 60)

        # Añadir variación aleatoria ±20%
        import random
        variation = random.uniform(0.8, 1.2)

        return base_time * variation

    def get_session_summary(self) -> Dict:
        """Resumen de la sesión"""
        total_duration = time.time() - self.session_start.timestamp()

        categories = {}
        for task in self.tasks:
            cat = task['category']
            if cat not in categories:
                categories[cat] = {'count': 0, 'total_time': 0}
            categories[cat]['count'] += 1
            categories[cat]['total_time'] += task['duration_seconds']

        return {
            'session_start': self.session_start.isoformat(),
            'session_duration_seconds': round(total_duration, 2),
            'session_duration_formatted': self.format_duration(total_duration),
            'total_tasks': len(self.tasks),
            'categories': categories,
            'tasks': self.tasks
        }

    def print_summary(self):
        """Imprimir resumen de la sesión"""
        summary = self.get_session_summary()

        print("\n" + "=" * 60)
        print("📊 RESUMEN DE SESIÓN")
        print("=" * 60)
        print(f"⏰ Duración total: {summary['session_duration_formatted']}")
        print(f"📋 Tareas completadas: {summary['total_tasks']}")
        print(f"\n📂 Por categoría:")

        for category, data in summary['categories'].items():
            avg_time = data['total_time'] / data['count']
            print(f"  • {category}:")
            print(f"    - Tareas: {data['count']}")
            print(f"    - Tiempo total: {self.format_duration(data['total_time'])}")
            print(f"    - Promedio: {self.format_duration(avg_time)}")

        print("\n📝 Desglose de tareas:")
        for i, task in enumerate(summary['tasks'], 1):
            print(f"  {i}. {task['task']}")
            print(f"     Categoría: {task['category']}")
            print(f"     Duración: {task['duration_formatted']}")

        print("=" * 60)

# Ejemplo de uso
if __name__ == "__main__":
    tracker = TimeTracker()

    # Simular una sesión de trabajo
    task1 = tracker.start_task("Crear componente ProductCard", "Desarrollo")
    time.sleep(2.5)  # Simular trabajo
    tracker.end_task(task1)

    task2 = tracker.start_task("Configurar Jest", "Testing")
    time.sleep(1.2)
    tracker.end_task(task2)

    task3 = tracker.start_task("Escribir documentación", "Documentación")
    time.sleep(4.8)
    tracker.end_task(task3)

    tracker.print_summary()
