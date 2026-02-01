using UnityEngine;

namespace CompartirLaMesa.Core
{
    /// <summary>
    /// Datos de un nivel: tiempo, desperdicio permitido, posiciones de nodos (opcional).
    /// Crear desde menú: Create > Compartir la Mesa > Level Data
    /// </summary>
    [CreateAssetMenu(fileName = "Level_01", menuName = "Compartir la Mesa/Level Data")]
    public class LevelData : ScriptableObject
    {
        [Header("Tiempo y límites")]
        [Tooltip("Tiempo en segundos para completar el nivel")]
        public float LevelTimeSeconds = 60f;
        [Tooltip("Unidades de comida que se pueden desperdiciar antes de derrota")]
        public int MaxWasteAllowed = 4;

        [Header("Fuentes (opcional: si no hay nodos en escena)")]
        public SourceNodeData[] Sources;

        [Header("Comunidades (opcional)")]
        public CommunityNodeData[] Communities;
    }

    [System.Serializable]
    public class SourceNodeData
    {
        public string Label = "Granja";
        public int InitialFood = 5;
        public float ShelfLifeSeconds = 30f;
        public Vector2 Position;
    }

    [System.Serializable]
    public class CommunityNodeData
    {
        public string Label = "Comunidad";
        public int FoodNeeded = 3;
        public Vector2 Position;
    }
}
