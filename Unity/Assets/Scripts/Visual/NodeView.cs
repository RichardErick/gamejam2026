using UnityEngine;
using UnityEngine.UI;

namespace CompartirLaMesa.Core
{
    /// <summary>
    /// Feedback visual del nodo: color según tipo y estado (seleccionado, satisfecho, vida útil).
    /// Asignar a un objeto hijo con SpriteRenderer o Image.
    /// </summary>
    [RequireComponent(typeof(SpriteRenderer))]
    public class NodeView : MonoBehaviour
    {
        public enum NodeType { Source, Community }

        [SerializeField] private NodeType nodeType;
        [SerializeField] private NodeBase node;
        [SerializeField] private Color colorDefault = new Color(0.18f, 0.54f, 0.37f);   // verde fuente
        [SerializeField] private Color colorHighlight = new Color(0.29f, 0.79f, 0.54f);
        [SerializeField] private Color colorCommunity = new Color(0.79f, 0.46f, 0.18f);
        [SerializeField] private Color colorCommunityFed = new Color(0.35f, 0.62f, 0.43f);

        private SpriteRenderer spriteRenderer;
        private Image image;

        private void Awake()
        {
            spriteRenderer = GetComponent<SpriteRenderer>();
            image = GetComponent<Image>();
            if (node == null)
                node = GetComponentInParent<NodeBase>();
        }

        private void Update()
        {
            if (node == null) return;
            Color c = GetColor();
            if (spriteRenderer != null) spriteRenderer.color = c;
            if (image != null) image.color = c;
        }

        private Color GetColor()
        {
            if (nodeType == NodeType.Source)
            {
                if (node.IsSelected) return colorHighlight;
                return colorDefault;
            }
            var community = node as CommunityNode;
            if (community != null && community.IsSatisfied) return colorCommunityFed;
            if (node.IsSelected) return colorHighlight;
            return colorCommunity;
        }
    }
}
