using UnityEngine;

namespace CompartirLaMesa.Core
{
    /// <summary>
    /// Una entrega en tránsito: de una fuente a una comunidad. Tiene duración y progreso.
    /// </summary>
    public class Delivery
    {
        public SourceNode From { get; private set; }
        public CommunityNode To { get; private set; }
        public float Duration { get; private set; }
        public float TimeLeft { get; set; }
        public float Progress => Duration > 0 ? 1f - (TimeLeft / Duration) : 1f;
        public Vector2 CurrentPosition { get; private set; }

        public Delivery(SourceNode from, CommunityNode to, float duration)
        {
            From = from;
            To = to;
            Duration = duration;
            TimeLeft = duration;
            CurrentPosition = from.Position2D;
        }

        public void Update(float dt)
        {
            TimeLeft -= dt;
            if (TimeLeft < 0f) TimeLeft = 0f;
            float t = Progress;
            CurrentPosition = Vector2.Lerp(From.Position2D, To.Position2D, t);
        }

        public bool IsComplete => TimeLeft <= 0f;
    }
}
