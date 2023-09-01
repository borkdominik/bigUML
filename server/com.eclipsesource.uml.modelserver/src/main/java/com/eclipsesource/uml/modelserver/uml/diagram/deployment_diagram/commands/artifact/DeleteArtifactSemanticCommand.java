/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.artifact;

import org.eclipse.uml2.uml.Artifact;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteArtifactSemanticCommand extends BaseDeleteSemanticChildCommand<Object, Artifact> {

   public DeleteArtifactSemanticCommand(final ModelContext context, final Artifact semanticElement) {
      super(context, semanticElement.getNearestPackage(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Object parent, final Artifact child) {
      child.destroy();
   }

}
