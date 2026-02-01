using UnityEngine;

namespace CompartirLaMesa.Core
{
    /// <summary>
    /// Opcional: inicializa el nivel desde LevelData (posiciones y parámetros de nodos).
    /// Coloca en la escena y asigna el LevelData; crea o configura nodos si usas datos por nivel.
    /// </summary>
    public class GameBootstrap : MonoBehaviour
    {
        [SerializeField] private LevelData levelData;
        [SerializeField] private GameObject sourcePrefab;
        [SerializeField] private GameObject communityPrefab;
        [SerializeField] private Transform nodesContainer;

        private void Start()
        {
            if (levelData == null) return;
            if (sourcePrefab != null && levelData.Sources != null && nodesContainer != null)
            {
                foreach (var s in levelData.Sources)
                {
                    var go = Instantiate(sourcePrefab, nodesContainer);
                    var sn = go.GetComponent<SourceNode>();
                    if (sn != null) sn.InitFromData(s);
                    go.transform.position = new Vector3(s.Position.x, s.Position.y, 0f);
                }
            }
            if (communityPrefab != null && levelData.Communities != null && nodesContainer != null)
            {
                foreach (var c in levelData.Communities)
                {
                    var go = Instantiate(communityPrefab, nodesContainer);
                    var cn = go.GetComponent<CommunityNode>();
                    if (cn != null) cn.InitFromData(c);
                    go.transform.position = new Vector3(c.Position.x, c.Position.y, 0f);
                }
            }
        }
    }
}
