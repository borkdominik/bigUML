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
package com.eclipsesource.uml.modelserver.old.diagram.activitydiagram.datanode;

public class AddParameterCommand { /*-implements Supplier<ActivityParameterNode> {

   private final Activity activity;
   private ActivityParameterNode param;

   public AddParameterCommand(final EditingDomain domain, final URI modelUri, final String actionUri) {
      super(domain, modelUri);
      activity = UmlSemanticCommandUtil.getElement(umlModel, actionUri, Activity.class);
   }

   @Override
   protected void doExecute() {
      param = UMLFactory.eINSTANCE.createActivityParameterNode();
      long count = activity.getOwnedNodes().stream().filter(ActivityParameterNode.class::isInstance).count();
      param.setName("NewParameter" + count);
      activity.getOwnedNodes().add(param);
   }

   @Override
   public ActivityParameterNode get() {
      return param;
   }
   */
}
