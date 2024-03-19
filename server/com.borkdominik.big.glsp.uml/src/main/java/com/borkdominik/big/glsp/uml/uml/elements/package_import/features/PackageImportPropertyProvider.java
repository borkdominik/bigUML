/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.package_import.features;

import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.uml2.uml.PackageImport;
import org.eclipse.uml2.uml.VisibilityKind;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.features.property_palette.handler.BGUpdateElementPropertyAction;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyBuilder;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyItem;
import com.borkdominik.big.glsp.server.features.property_palette.provider.integrations.BGEMFElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.commands.UMLUpdateElementCommand;
import com.borkdominik.big.glsp.uml.uml.elements.element.VisibilityKindUtils;
import com.borkdominik.big.glsp.uml.uml.elements.package_import.utils.PackageImportPropertyPaletteUtils;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PackageImportPropertyProvider extends BGEMFElementPropertyProvider<PackageImport> {

   public static final String VISIBILITY_KIND = "visibilityKind";
   public static final String IMPORTED_PACKAGE = "importedPackage";

   @Inject
   public PackageImportPropertyProvider(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes, Set.of(VISIBILITY_KIND));
   }

   @Override
   public List<ElementPropertyItem> doProvide(final PackageImport element) {
      var elementId = providerContext.idGenerator().getOrCreateId(element);
      var builder = new ElementPropertyBuilder(elementId)
         .choice(
            VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            element.getVisibility().getLiteral())
         .reference(
            IMPORTED_PACKAGE,
            "Imported Package",
            PackageImportPropertyPaletteUtils.asReferenceFromPackage(List.of(element.getImportedPackage()),
               providerContext.idGenerator()),
            List.of(),
            false);

      return builder.items();
   }

   @Override
   public Command doHandle(final BGUpdateElementPropertyAction action, final PackageImport element) {
      var value = action.getValue();
      var argument = UMLUpdateElementCommand.Argument
         .<PackageImport> updateElementArgumentBuilder()
         .consumer(e -> {
            switch (action.getPropertyId()) {
               case VISIBILITY_KIND:
                  e.setVisibility(VisibilityKind.get(value));
                  break;
            }
         })
         .build();

      return new UMLUpdateElementCommand<>(context, modelState.getSemanticModel(), element, argument);
   }
}
