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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.condition;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.Constraint;
import org.eclipse.uml2.uml.OpaqueExpression;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class AddConditionCommand extends UmlSemanticElementCommand {

   protected final Activity activity;
   protected final Constraint condition;

   public AddConditionCommand(final EditingDomain domain, final URI modelUri, final String parentUri,
      final boolean precondition) {
      super(domain, modelUri);
      activity = UmlSemanticCommandUtil.getElement(umlModel, parentUri, Activity.class);
      condition = UMLFactory.eINSTANCE.createConstraint();
      OpaqueExpression specification = UMLFactory.eINSTANCE.createOpaqueExpression();
      condition.setSpecification(specification);
      // specification.getBodies().add((precondition ? "pre" : "post") + ":true");
      specification.getBodies().add("true");
   }

   @Override
   protected void doExecute() {
      activity.getOwnedRules().add(condition);
   }

}
