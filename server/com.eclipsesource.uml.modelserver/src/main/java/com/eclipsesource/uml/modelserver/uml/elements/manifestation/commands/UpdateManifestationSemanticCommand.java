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
package com.eclipsesource.uml.modelserver.uml.elements.manifestation.commands;

import java.util.List;

import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Manifestation;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementSemanticCommand;

public final class UpdateManifestationSemanticCommand
   extends BaseUpdateSemanticElementCommand<Manifestation, UpdateManifestationArgument> {

   public UpdateManifestationSemanticCommand(final ModelContext context, final Manifestation semanticElement,
      final UpdateManifestationArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Manifestation semanticElement,
      final UpdateManifestationArgument updateArgument) {
      include(List.of(new UpdateNamedElementSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.clientIds().ifPresent(arg -> {
         var parent = semanticElementAccessor.getElement(arg.get(0), Artifact.class).get();
         parent.getManifestations().add(semanticElement);
      });

      updateArgument.supplierIds().ifPresent(arg -> {
         semanticElement.getSuppliers().clear();
         semanticElement
            .setUtilizedElement(semanticElementAccessor.getElement(arg.get(0), PackageableElement.class).get());
      });
   }

}
