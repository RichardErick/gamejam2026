using UnityEngine;

namespace CompartirLaMesa.Core
{
    /// <summary>
    /// Nodo comunidad. Necesita X unidades de comida; cuando las recibe, queda satisfecha.
    /// </summary>
    public class CommunityNode : NodeBase
    {
        [Header("Necesidad")]
        [SerializeField] private int foodNeeded = 3;

        private int received;

        public int FoodNeeded => foodNeeded;
        public int Received => received;
        public bool IsSatisfied => received >= foodNeeded;
        public float SatisfactionPercent => foodNeeded > 0 ? Mathf.Clamp01((float)received / foodNeeded) : 1f;

        private void Start()
        {
            received = 0;
        }

        public override void ResetToLevel()
        {
            received = 0;
        }

        public void ReceiveFood(int amount = 1)
        {
            received = Mathf.Min(received + amount, foodNeeded);
            if (GameManager.Instance)
                GameManager.Instance.CheckWinCondition(GetAllCommunities());
        }

        private static System.Collections.Generic.List<CommunityNode> GetAllCommunities()
        {
            var list = new System.Collections.Generic.List<CommunityNode>();
            foreach (var c in FindObjectsByType<CommunityNode>(FindObjectsSortMode.None))
                list.Add(c);
            return list;
        }

        public void InitFromData(CommunityNodeData data)
        {
            if (data == null) return;
            nodeLabel = data.Label;
            foodNeeded = data.FoodNeeded;
            transform.position = new Vector3(data.Position.x, data.Position.y, 0f);
            ResetToLevel();
        }
    }
}
