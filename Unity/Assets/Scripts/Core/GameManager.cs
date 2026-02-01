using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace CompartirLaMesa.Core
{
    /// <summary>
    /// Controla el flujo del nivel: tiempo, victoria/derrota, desperdicio y transición entre niveles.
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("Configuración del nivel")]
        [SerializeField] private float levelTimeSeconds = 60f;
        [SerializeField] private int maxWasteAllowed = 4;
        [SerializeField] private int currentLevelIndex = 0;

        [Header("Referencias")]
        [SerializeField] private LevelData[] levels;
        [SerializeField] private UIManager uiManager;

        private float timeLeft;
        private int wasteCount;
        private bool gameOver;
        private bool gameWon;
        private LevelData currentLevelData;

        public float TimeLeft => timeLeft;
        public int WasteCount => wasteCount;
        public int MaxWasteAllowed => maxWasteAllowed;
        public bool IsGameOver => gameOver;
        public bool IsGameWon => gameWon;
        public LevelData CurrentLevel => currentLevelData;

        public event Action OnLevelStarted;
        public event Action<bool> OnLevelEnded;
        public event Action<float> OnTimeUpdated;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        private void Start()
        {
            if (levels != null && levels.Length > 0)
                LoadLevel(currentLevelIndex);
            else
                StartLevel();
        }

        public void LoadLevel(int index)
        {
            currentLevelIndex = Mathf.Clamp(index, 0, levels.Length - 1);
            currentLevelData = levels[currentLevelIndex];
            if (currentLevelData != null)
            {
                levelTimeSeconds = currentLevelData.LevelTimeSeconds;
                maxWasteAllowed = currentLevelData.MaxWasteAllowed;
            }
            StartLevel();
        }

        public void StartLevel()
        {
            timeLeft = levelTimeSeconds;
            wasteCount = 0;
            gameOver = false;
            gameWon = false;
            OnLevelStarted?.Invoke();
            OnTimeUpdated?.Invoke(timeLeft);
            if (uiManager) uiManager.HideEndPanel();
        }

        private void Update()
        {
            if (gameOver) return;

            timeLeft -= Time.deltaTime;
            OnTimeUpdated?.Invoke(timeLeft);

            if (timeLeft <= 0f)
            {
                timeLeft = 0f;
                EndLevel(false);
            }
        }

        public void AddWaste(int amount = 1)
        {
            wasteCount += amount;
        }

        public void CheckWinCondition(List<CommunityNode> communities)
        {
            if (communities == null || gameOver) return;
            bool allFed = true;
            foreach (var c in communities)
            {
                if (c == null) continue;
                if (!c.IsSatisfied)
                {
                    allFed = false;
                    break;
                }
            }
            if (allFed)
                EndLevel(true);
        }

        public void EndLevel(bool won)
        {
            if (gameOver) return;
            gameOver = true;
            gameWon = won;
            OnLevelEnded?.Invoke(won);
            if (uiManager) uiManager.ShowEndPanel(won, wasteCount, maxWasteAllowed);
        }

        public void RestartLevel()
        {
            StartLevel();
            var dm = FindFirstObjectByType<DeliveryManager>();
            if (dm) dm.ClearAll();
            var nodes = FindObjectsByType<NodeBase>(FindObjectsSortMode.None);
            foreach (var n in nodes)
            {
                if (n is SourceNode sn) sn.ResetToLevel();
                if (n is CommunityNode cn) cn.ResetToLevel();
            }
        }

        public void NextLevel()
        {
            if (levels != null && currentLevelIndex + 1 < levels.Length)
            {
                currentLevelIndex++;
                SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
            }
            else
                RestartLevel();
        }

        public void QuitToMenu()
        {
            SceneManager.LoadScene(0);
        }

        private void OnDestroy()
        {
            if (Instance == this)
                Instance = null;
        }
    }
}
