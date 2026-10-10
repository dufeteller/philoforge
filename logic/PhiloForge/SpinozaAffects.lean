namespace PhiloForge.Spinoza.Affects

-- Ethics III D1-D2: a relational reconstruction, not all meanings of action.
structure Vocabulary (Entity Event : Type) where
  causes : Entity → Event → Prop
  understoodThroughAlone : Event → Entity → Prop

-- D1: the effect is clearly and distinctly understood through this cause alone.
def AdequateCause {Entity Event : Type} (v : Vocabulary Entity Event)
    (x : Entity) (e : Event) : Prop :=
  v.causes x e ∧ v.understoodThroughAlone e x

-- D1: a partial cause does not suffice to understand the effect through it alone.
def PartialCause {Entity Event : Type} (v : Vocabulary Entity Event)
    (x : Entity) (e : Event) : Prop :=
  v.causes x e ∧ ¬ v.understoodThroughAlone e x

-- D2: these definitions concern one actor and one event, not a whole life/mind.
def Active {Entity Event : Type} (v : Vocabulary Entity Event)
    (x : Entity) (e : Event) : Prop := AdequateCause v x e

def Passive {Entity Event : Type} (v : Vocabulary Entity Event)
    (x : Entity) (e : Event) : Prop := PartialCause v x e

-- A definitional consequence, not a separately numbered Spinoza proposition.
theorem adequate_not_partial {Entity Event : Type} (v : Vocabulary Entity Event)
    (x : Entity) (e : Event) (h : AdequateCause v x e) :
    ¬ PartialCause v x e := by
  intro hpartial
  exact hpartial.2 h.2

-- Same event, same actor: activity excludes passivity in this encoding.
theorem active_not_passive {Entity Event : Type} (v : Vocabulary Entity Event)
    (x : Entity) (e : Event) (h : Active v x e) : ¬ Passive v x e := by
  exact adequate_not_partial v x e h

#print axioms adequate_not_partial
#print axioms active_not_passive
end PhiloForge.Spinoza.Affects
