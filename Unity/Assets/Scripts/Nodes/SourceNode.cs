using System.Collections.Generic;
using UnityEngine;

namespace CompartirLaMesa.Core
{
    /// <summary>
    /// Nodo fuente (granja, mercado). Tiene comida con vida útil; si no se envía a tiempo, se desperdicia.
    /// </summary>
    public class SourceNode : NodeBase
    {
        [Header("Recursos")]
        [SerializeField] private int initialFood = 5;
        [SerializeField] private float shelfLifeSeconds = 30f;

        private int currentFood;
        private float shelfLifeLeft; // por "unidad" simplificado: una cuenta atrás global por fuente
        private List<float> shelfLifePerUnit = new List<float>();

        public int CurrentFood => currentFood;
        public float ShelfLifePercent => shelfLifeSeconds > 0 && shelfLifePerUnit.Count > 0
            ? Mathf.Clamp01(shelfLifePerUnit[0] / shelfLifeSeconds)
            : 1f;

        public bool HasFood => currentFood > 0;
        public bool CanSend => currentFood > 0;

        private void Start()
        {
            ResetToLevel();
        }

        public override void ResetToLevel()
        {
            currentFood = initialFood;
            shelfLifePerUnit.Clear();
            for (int i = 0; i < initialFood; i++)
                shelfLifePerUnit.Add(shelfLifeSeconds);
        }

        private void Update()
        {
            if (currentFood <= 0) return;
            float dt = Time.deltaTime;
            for (int i = shelfLifePerUnit.Count - 1; i >= 0; i--)
            {
                shelfLifePerUnit[i] -= dt;
                if (shelfLifePerUnit[i] <= 0f)
                {
                    shelfLifePerUnit.RemoveAt(i);
                    currentFood--;
                    if (GameManager.Instance)
                        GameManager.Instance.AddWaste(1);
                }
            }
        }

        /// <summary>
        /// Consume una unidad de comida para enviar. Devuelve true si había y se quitó.
        /// </summary>
        public bool TryTakeOne(out float remainingShelfLife)
        {
            remainingShelfLife = 0f;
            if (currentFood <= 0 || shelfLifePerUnit.Count <= 0) return false;
            remainingShelfLife = shelfLifePerUnit[0];
            shelfLifePerUnit.RemoveAt(0);
            currentFood--;
            return true;
        }

        public void InitFromData(SourceNodeData data)
        {
            if (data == null) return;
            nodeLabel = data.Label;
            initialFood = data.InitialFood;
            shelfLifeSeconds = data.ShelfLifeSeconds;
            transform.position = new Vector3(data.Position.x, data.Position.y, 0f);
            ResetToLevel();
        }
    }
}
