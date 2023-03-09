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
package com.eclipsesource.uml.modelserver.old.diagram.activitydiagram.activity;

public class RemoveActivityCommand { /*-

   private final Activity activity;

   public RemoveActivityCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
      super(domain, modelUri);
      activity = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Activity.class);
   }

   public Set<Element> getOwnedElements() {
      Set<Element> children = activity.getOwnedElements().stream().collect(Collectors.toSet());
      children.addAll(activity.getPartitions().stream()
         .filter(ActivityPartition.class::isInstance)
         .map(ActivityPartition.class::cast)
         .flatMap(partition -> getOwnedElements(partition).stream())
         .collect(Collectors.toSet()));
      return children;
   }

   public Set<Element> getReferencingCallBehaviorActions() {
      return activity.getModel().getPackagedElements().stream()
         .filter(Activity.class::isInstance)
         .map(Activity.class::cast)
         .flatMap(a -> a.getOwnedNodes().stream())
         .filter(CallBehaviorAction.class::isInstance)
         .map(CallBehaviorAction.class::cast)
         .filter(cba -> activity.equals(cba.getBehavior()))
         .collect(Collectors.toSet());
   }

   private List<Element> getOwnedElements(final ActivityPartition partition) {
      List<Element> elems = new ArrayList<>();
      for (ActivityPartition sub : partition.getSubpartitions()) {
         elems.add(sub);
         elems.addAll(getOwnedElements(sub));
      }
      return elems;
   }

   @Override
   protected void doExecute() {
      activity.getOwner().getOwnedComments().stream()
         .filter(c -> c.getAnnotatedElements().contains(activity))
         .collect(Collectors.toList())
         .forEach(c -> c.getAnnotatedElements().remove(activity));
      activity.getModel().getPackagedElements().remove(activity);
   }
   */
}
