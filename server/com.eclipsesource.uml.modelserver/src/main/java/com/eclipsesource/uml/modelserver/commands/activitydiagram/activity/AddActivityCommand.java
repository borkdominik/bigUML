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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.activity;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class AddActivityCommand extends UmlSemanticElementCommand {

   protected final Activity newActivity;

   public AddActivityCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      this.newActivity = UMLFactory.eINSTANCE.createActivity();
   }

   @Override
   protected void doExecute() {
      newActivity.setName(UmlSemanticCommandUtil.getNewPackageableElementName(umlModel, Activity.class));
      umlModel.getPackagedElements().add(newActivity);
   }

   public Activity getNewActivity() { return newActivity; }

}
