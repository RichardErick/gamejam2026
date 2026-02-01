using UnityEngine;
using UnityEngine.EventSystems;

namespace CompartirLaMesa.Core
{
    /// <summary>
    /// Maneja clic/tap: selecciona fuente, luego comunidad para enviar entrega.
    /// Compatible con ratón (PC) y touch (móvil).
    /// </summary>
    public class NodeInputHandler : MonoBehaviour
    {
        [SerializeField] private Camera gameCamera;
        [SerializeField] private float maxRayDistance = 100f;

        private SourceNode selectedSource;
        private LayerMask nodeLayer;

        private void Awake()
        {
            if (gameCamera == null)
                gameCamera = Camera.main;
            nodeLayer = LayerMask.GetMask("Default");
        }

        private void Update()
        {
            if (GameManager.Instance != null && GameManager.Instance.IsGameOver)
                return;
            if (Input.GetMouseButtonDown(0) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began))
            {
                if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject())
                    return;
                TryHandleClick(GetWorldPoint());
            }
        }

        private Vector2 GetWorldPoint()
        {
            if (Input.touchCount > 0)
            {
                Touch t = Input.GetTouch(0);
                return gameCamera != null ? gameCamera.ScreenToWorldPoint(new Vector3(t.position.x, t.position.y, -gameCamera.transform.position.z)) : Vector2.zero;
            }
            Vector3 mouse = Input.mousePosition;
            mouse.z = gameCamera != null ? -gameCamera.transform.position.z : 10f;
            return gameCamera != null ? gameCamera.ScreenToWorldPoint(mouse) : Vector2.zero;
        }

        private void TryHandleClick(Vector2 worldPoint)
        {
            var source = FindNodeAt<SourceNode>(worldPoint);
            var community = FindNodeAt<CommunityNode>(worldPoint);

            if (community != null && selectedSource != null)
            {
                if (DeliveryManager.Instance != null && selectedSource.CanSend && !community.IsSatisfied)
                    DeliveryManager.Instance.TryStartDelivery(selectedSource, community);
                SetSelectedSource(null);
                return;
            }

            if (source != null && source.HasFood)
            {
                SetSelectedSource(selectedSource == source ? null : source);
                return;
            }

            SetSelectedSource(null);
        }

        private T FindNodeAt<T>(Vector2 worldPoint) where T : NodeBase
        {
            T found = null;
            float minDist = float.MaxValue;
            foreach (var n in FindObjectsByType<T>(FindObjectsSortMode.None))
            {
                if (!n.ContainsPoint(worldPoint)) continue;
                float d = Vector2.Distance(n.Position2D, worldPoint);
                if (d < minDist) { minDist = d; found = n; }
            }
            return found;
        }

        private void SetSelectedSource(SourceNode source)
        {
            if (selectedSource != null)
                selectedSource.SetSelected(false);
            selectedSource = source;
            if (selectedSource != null)
                selectedSource.SetSelected(true);
        }
    }
}
