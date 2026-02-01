using UnityEngine;

namespace CompartirLaMesa.Core
{
    /// <summary>
    /// Base para nodos del mapa (fuentes y comunidades). Proporciona posición y selección.
    /// </summary>
    public abstract class NodeBase : MonoBehaviour
    {
        [SerializeField] protected string nodeLabel = "Nodo";
        [SerializeField] protected float interactionRadius = 1.5f;

        protected bool isSelected;

        public string NodeLabel => nodeLabel;
        public bool IsSelected => isSelected;
        public float InteractionRadius => interactionRadius;

        public Vector2 Position2D => new Vector2(transform.position.x, transform.position.y);

        public virtual void SetSelected(bool selected)
        {
            isSelected = selected;
        }

        public virtual void ResetToLevel() { }

        /// <summary>
        /// ¿El punto (mundo 2D) está dentro del radio de interacción?
        /// </summary>
        public bool ContainsPoint(Vector2 worldPoint)
        {
            return Vector2.Distance(Position2D, worldPoint) <= interactionRadius;
        }

#if UNITY_EDITOR
        private void OnDrawGizmosSelected()
        {
            Gizmos.color = Color.yellow;
            Gizmos.DrawWireSphere(transform.position, interactionRadius);
        }
#endif
    }
}
