using System.Collections.Generic;
using UnityEngine;

namespace CompartirLaMesa.Core
{
    /// <summary>
    /// Dibuja las rutas de entregas en tránsito (líneas desde fuente hasta posición actual del envío).
    /// Usa LineRenderer o Gizmos. Asignar prefab de LineRenderer si quieres ver líneas en Game.
    /// </summary>
    public class DeliveryRouteDrawer : MonoBehaviour
    {
        [SerializeField] private LineRenderer linePrefab;
        [SerializeField] private float lineWidth = 0.1f;
        [SerializeField] private Material lineMaterial;
        [SerializeField] private int segmentsPerLine = 20;

        private readonly List<LineRenderer> lines = new List<LineRenderer>();
        private DeliveryManager deliveryManager;

        private void Start()
        {
            deliveryManager = FindFirstObjectByType<DeliveryManager>();
        }

        private void LateUpdate()
        {
            if (deliveryManager == null) return;
            var deliveries = deliveryManager.Deliveries;
            while (lines.Count < deliveries.Count)
            {
                if (linePrefab != null)
                {
                    var lr = Instantiate(linePrefab, transform);
                    lr.positionCount = 2;
                    if (lineMaterial != null) lr.material = lineMaterial;
                    lr.startWidth = lineWidth;
                    lr.endWidth = lineWidth * 0.5f;
                    lines.Add(lr);
                }
                else
                    lines.Add(null);
            }
            while (lines.Count > deliveries.Count && lines.Count > 0)
            {
                var last = lines[lines.Count - 1];
                if (last != null) Destroy(last.gameObject);
                lines.RemoveAt(lines.Count - 1);
            }

            for (int i = 0; i < deliveries.Count; i++)
            {
                var d = deliveries[i];
                if (i < lines.Count && lines[i] != null)
                {
                    lines[i].SetPosition(0, new Vector3(d.From.Position2D.x, d.From.Position2D.y, -0.5f));
                    lines[i].SetPosition(1, new Vector3(d.CurrentPosition.x, d.CurrentPosition.y, -0.5f));
                    lines[i].gameObject.SetActive(true);
                }
            }
        }

#if UNITY_EDITOR
        private void OnDrawGizmos()
        {
            if (deliveryManager == null) deliveryManager = FindFirstObjectByType<DeliveryManager>();
            if (deliveryManager == null) return;
            foreach (var d in deliveryManager.Deliveries)
            {
                Gizmos.color = Color.green;
                Gizmos.DrawLine(d.From.transform.position, new Vector3(d.CurrentPosition.x, d.CurrentPosition.y, 0f));
            }
        }
#endif
    }
}
