package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram.gmodel;

public class StateMachineDiagramPortFactory { /*-

   public StateMachineDiagramPortFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GPort create(final Pseudostate umlPseudostate) {
      switch (umlPseudostate.getKind().getValue()) {
         case PseudostateKind.ENTRY_POINT:
            return createEntryPoint(umlPseudostate);
         case PseudostateKind.EXIT_POINT:
            return createExitPoint(umlPseudostate);
      }
      return null;
   }

   protected GPort createEntryPoint(final Pseudostate entryPoint) {
      GPortBuilder b = new GPortBuilder(StateMachineTypes.ENTRY_POINT)
         .id(toId(entryPoint))
         .size(30, 30)
         .addCssClass(CSS.NODE);

      applyShapeData(entryPoint, b);
      return b.build();
   }

   protected GPort createExitPoint(final Pseudostate exitPoint) {
      GPortBuilder b = new GPortBuilder(StateMachineTypes.EXIT_POINT)
         .id(toId(exitPoint))
         .size(30, 30)
         .addCssClass(CSS.NODE);

      applyShapeData(exitPoint, b);
      return b.build();
   }

   protected void applyShapeData(final Pseudostate pseudostate, final GPortBuilder builder) {
      modelState.getIndex().getNotation(pseudostate, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         } else if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }
   */
}
