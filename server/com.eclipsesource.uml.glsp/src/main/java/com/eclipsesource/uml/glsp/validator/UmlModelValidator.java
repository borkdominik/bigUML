/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.validator;

//TODO
public class UmlModelValidator {/*implements ModelValidator {

   @Override
   public List<Marker> validate(final GModelState graphicalModelState, final GModelElement... elements) {

      List<Marker> markers = new ArrayList<>();
      UmlModelState modelState = UmlModelState.getModelState(graphicalModelState);
      for (GModelElement e : elements) {
         EObject semanticElement = modelState.getIndex().getSemantic(e.getId()).get();
         System.out.println("element to validate: " + semanticElement.getClass().getSimpleName());
         // CLASS DIAGRAM
         if (semanticElement instanceof Class) {
            System.out.println("çclass validation");
            markers.addAll(validateClassNode(modelState, (Class) semanticElement));
         } if (semanticElement instanceof Activity) {
            markers.addAll(looseActivityNodes((Activity) semanticElement, modelState));
            markers.addAll(referenceLessCalls((Activity) semanticElement, modelState));
         }
      }
      System.out.println("markers " + markers);
      System.out.println("marker size: " + markers.size());
      return markers;
   }

   /**
    * CLASS DIAGRAM
    * Searches for not connected classes
    */
   /*public static List<Marker> validateClassNode(final UmlModelState modelState, final Class umlClass) {
      List<Marker> markers = new ArrayList<>();
      if(validateClassNode_classIsNotConnected(modelState, umlClass) != null) {
         System.out.println("goes into class validation node if");
         markers.add(validateClassNode_classIsNotConnected(modelState, umlClass));
      }
      //validateClassNode_classIsNotConnected(modelState, umlClass);
      return markers;
   }


   @SuppressWarnings("checkstyle:MethodName")
   private static Marker validateClassNode_classIsNotConnected(final UmlModelState modelState, final Class umlClass) {
      System.out.println("in class sub validation");
      String classId = modelState.getIndex().getSemanticId(umlClass).toString();
      Collection<Association> associations = new ArrayList<>(umlClass.getAssociations());
      if (associations.size() <= 1) {
         System.out.println("goes into association if");
         return new Marker("Unconnected Class", "A Class node should have at least one connected Association",
                 classId, MarkerKind.ERROR);
      }
      return null;
   }

   private List<Marker> looseActivityNodes(final Activity activity, final UmlModelState modelState) {
      return activity.getOwnedNodes().stream()
              .filter(n -> isLooseNode(activity, n) && !isExceptionHandlerAction(activity, n))
              .map(n -> modelState.getIndex().getSemanticId(n))
              .filter(o -> o.isPresent())
              .map(o -> o.get())
              .map(semanticId -> new Marker("Loose Node", "A loose Node is useless", semanticId, MarkerKind.WARNING))
              .collect(Collectors.toList());
   }

   private boolean isLooseNode(final Activity activity, final ActivityNode node) {
      return activity.getEdges().stream().noneMatch(e -> e.getSource().equals(node) || e.getTarget().equals(node));
   }

   private boolean isExceptionHandlerAction(final Activity activity, final ActivityNode node) {
      return ActivityUtil.getAllExceptionHandlers(activity).stream().anyMatch(h -> h.getHandlerBody().equals(node));
   }

   private List<Marker> referenceLessCalls(final Activity activity, final UmlModelState modelState) {
      return activity.getOwnedNodes().stream()
              .filter(CallBehaviorAction.class::isInstance)
              .map(CallBehaviorAction.class::cast)
              .filter(cba -> cba.getBehavior() == null)
              .map(cba -> modelState.getIndex().getSemanticId(cba))
              .filter(o -> o.isPresent())
              .map(o -> o.get())
              .map(id -> new Marker("Referencelsess CallAction", "A CallAction needs to reference some Behavior", id,
                      MarkerKind.ERROR))
              .collect(Collectors.toList());
   }*/

}
