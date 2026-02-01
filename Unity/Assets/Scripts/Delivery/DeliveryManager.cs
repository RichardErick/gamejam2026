using System.Collections.Generic;
using UnityEngine;

namespace CompartirLaMesa.Core
{
    /// <summary>
    /// Gestiona las entregas en tránsito: crea nuevas (fuente → comunidad) y actualiza/elimina las completadas.
    /// </summary>
    public class DeliveryManager : MonoBehaviour
    {
        public static DeliveryManager Instance { get; private set; }

        [Header("Configuración")]
        [SerializeField] private float deliveryDuration = 4f;

        [Header("Visual (opcional)")]
        [SerializeField] private Transform deliveryIconPrefab;
        [SerializeField] private LineRenderer routeLinePrefab;

        private readonly List<Delivery> deliveries = new List<Delivery>();
        private readonly List<Transform> deliveryIcons = new List<Transform>();

        public float DeliveryDuration => deliveryDuration;
        public IReadOnlyList<Delivery> Deliveries => deliveries;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public bool TryStartDelivery(SourceNode from, CommunityNode to)
        {
            if (from == null || to == null) return false;
            if (!from.CanSend || to.IsSatisfied) return false;
            if (!from.TryTakeOne(out _)) return false;

            var d = new Delivery(from, to, deliveryDuration);
            deliveries.Add(d);

            if (deliveryIconPrefab != null)
            {
                var icon = Instantiate(deliveryIconPrefab, transform);
                deliveryIcons.Add(icon);
            }

            return true;
        }

        private void Update()
        {
            float dt = Time.deltaTime;
            for (int i = deliveries.Count - 1; i >= 0; i--)
            {
                var d = deliveries[i];
                d.Update(dt);

                if (d.IsComplete)
                {
                    d.To.ReceiveFood(1);
                    deliveries.RemoveAt(i);
                    if (i < deliveryIcons.Count && deliveryIcons[i] != null)
                    {
                        Destroy(deliveryIcons[i].gameObject);
                        deliveryIcons.RemoveAt(i);
                    }
                }
            }

            for (int i = 0; i < deliveries.Count; i++)
            {
                if (i < deliveryIcons.Count && deliveryIcons[i] != null)
                    deliveryIcons[i].position = new Vector3(
                        deliveries[i].CurrentPosition.x,
                        deliveries[i].CurrentPosition.y,
                        -1f
                    );
            }
        }

        public void ClearAll()
        {
            deliveries.Clear();
            foreach (var icon in deliveryIcons)
            {
                if (icon != null) Destroy(icon.gameObject);
            }
            deliveryIcons.Clear();
        }

        private void OnDestroy()
        {
            if (Instance == this)
                Instance = null;
        }
    }
}
