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
package com.borkdominik.big.glsp.uml.uml.elements.package_.features;

import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.uml2.uml.Package;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.features.property_palette.handler.BGUpdateElementPropertyAction;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyBuilder;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyItem;
import com.borkdominik.big.glsp.server.features.property_palette.provider.integrations.BGEMFElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.commands.UMLUpdateElementCommand;
import com.borkdominik.big.glsp.uml.uml.elements.package_import.utils.PackageImportPropertyPaletteUtils;
import com.borkdominik.big.glsp.uml.uml.elements.package_merge.utils.PackageMergePropertyPaletteUtils;
import com.borkdominik.big.glsp.uml.uml.utils.element.ElementImportPropertyPaletteUtils;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PackagePropertyProvider extends BGEMFElementPropertyProvider<Package> {

   public static final String URI = "uri";
   public static final String ELEMENT_IMPORTS = "elementImports";
   public static final String PACKAGE_IMPORTS = "packageImports";
   public static final String PACKAGE_MERGES = "packageMerges";

   @Inject
   public PackagePropertyProvider(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes, Set.of(URI));
   }

   @Override
   public List<ElementPropertyItem> doProvide(final Package element) {
      var elementId = providerContext.idGenerator().getOrCreateId(element);
      var builder = new ElementPropertyBuilder(elementId)
         .text(URI, "URI", element.getURI());

      if (providerContext.elementConfig().has(UMLTypes.PACKAGE_IMPORT)) {
         builder.reference(
            PACKAGE_IMPORTS,
            "Package Import",
            PackageImportPropertyPaletteUtils.asReferenceFromPackageImport(element.getPackageImports(),
               providerContext.idGenerator()));
      }

      if (providerContext.elementConfig().has(UMLTypes.PACKAGE_MERGE)) {
         builder.reference(
            PACKAGE_MERGES,
            "Package Merge",
            PackageMergePropertyPaletteUtils.asReferences(element.getPackageMerges(), providerContext.idGenerator()));
      }

      if (providerContext.elementConfig().has(UMLTypes.ELEMENT_IMPORT)) {
         builder.reference(
            ELEMENT_IMPORTS,
            "Element Import",
            ElementImportPropertyPaletteUtils.asReferenceFromElementImports(element.getElementImports(),
               providerContext.idGenerator()));
      }

      return builder.items();
   }

   @Override
   public Command doHandle(final BGUpdateElementPropertyAction action, final Package element) {
      var value = action.getValue();
      var argument = UMLUpdateElementCommand.Argument
         .<Package> updateElementArgumentBuilder()
         .consumer(e -> {
            switch (action.getPropertyId()) {
               case URI:
                  e.setURI(value);
                  break;
            }
         })
         .build();

      return new UMLUpdateElementCommand<>(context, modelState.getSemanticModel(), element, argument);
   }
}
