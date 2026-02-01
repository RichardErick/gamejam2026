using UnityEngine;
using UnityEngine.UI;

namespace CompartirLaMesa.Core
{
    /// <summary>
    /// HUD (tiempo, desperdicio) y panel de fin de nivel (victoria/derrota, reiniciar, siguiente nivel).
    /// Asigna los Text o TextMeshProUGUI que tengas en tu Canvas.
    /// </summary>
    public class UIManager : MonoBehaviour
    {
        [Header("HUD")]
        [SerializeField] private Text timerText;
        [SerializeField] private Text wasteText;
        [SerializeField] private Slider timerSlider;

        [Header("Panel fin de nivel")]
        [SerializeField] private GameObject endPanel;
        [SerializeField] private Text endTitleText;
        [SerializeField] private Text endMessageText;
        [SerializeField] private Button restartButton;
        [SerializeField] private Button nextLevelButton;

        [Header("Mensajes")]
        [SerializeField] private string victoryTitle = "¡Comunidades alimentadas!";
        [SerializeField] private string victoryMessage = "Compartir la mesa tiene impacto.";
        [SerializeField] private string defeatTimeTitle = "Se acabó el tiempo";
        [SerializeField] private string defeatTimeMessage = "Prioriza mejor la distribución.";
        [SerializeField] private string defeatWasteTitle = "Demasiado desperdicio";
        [SerializeField] private string defeatWasteMessage = "Las decisiones importan.";

        private float maxTime;

        private void Start()
        {
            if (GameManager.Instance != null)
            {
                maxTime = GameManager.Instance.TimeLeft;
                GameManager.Instance.OnTimeUpdated += OnTimeUpdated;
            }
            if (restartButton != null)
                restartButton.onClick.AddListener(OnRestart);
            if (nextLevelButton != null)
                nextLevelButton.onClick.AddListener(OnNextLevel);
            HideEndPanel();
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
                GameManager.Instance.OnTimeUpdated -= OnTimeUpdated;
        }

        private void OnTimeUpdated(float timeLeft)
        {
            int seconds = Mathf.Max(0, Mathf.CeilToInt(timeLeft));
            if (timerText != null) timerText.text = seconds.ToString();
            if (wasteText != null) wasteText.text = GameManager.Instance != null ? GameManager.Instance.WasteCount.ToString() : "0";
            if (timerSlider != null && maxTime > 0)
                timerSlider.value = timeLeft / maxTime;
        }

        public void ShowEndPanel(bool won, int waste, int maxWasteAllowed)
        {
            if (endPanel != null) endPanel.SetActive(true);
            string title = won ? victoryTitle : (waste > maxWasteAllowed ? defeatWasteTitle : defeatTimeTitle);
            string msg = won ? victoryMessage : (waste > maxWasteAllowed ? defeatWasteMessage : defeatTimeMessage);
            if (endTitleText != null) endTitleText.text = title;
            if (endMessageText != null) endMessageText.text = msg;
            if (nextLevelButton != null)
                nextLevelButton.gameObject.SetActive(won && GameManager.Instance != null && GameManager.Instance.CurrentLevel != null);
        }

        public void HideEndPanel()
        {
            if (endPanel != null) endPanel.SetActive(false);
        }

        private void OnRestart()
        {
            if (GameManager.Instance != null)
                GameManager.Instance.RestartLevel();
            OnTimeUpdated(GameManager.Instance != null ? GameManager.Instance.TimeLeft : 60f);
        }

        private void OnNextLevel()
        {
            if (GameManager.Instance != null)
                GameManager.Instance.NextLevel();
        }
    }
}
