/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.package_import.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageImport;

import com.borkdominik.big.glsp.server.features.property_palette.model.ElementReferencePropertyItem;

public class PackageImportPropertyPaletteUtils {

   public static List<ElementReferencePropertyItem.Reference> asReferenceFromPackageImport(
      final List<PackageImport> packageImports,
      final EMFIdGenerator idGenerator) {
      var references = packageImports.stream()
         .map(v -> {
            var p = v.getImportedPackage();
            var label = String.format("<Package Import> %s", p.getName());
            return ElementReferencePropertyItem.Reference.builder()
               .elementId(idGenerator.getOrCreateId(p))
               .label(label)
               .name(p.getName())
               .build();
         })
         .collect(Collectors.toList());

      return references;
   }

   public static List<ElementReferencePropertyItem.Reference> asReferenceFromPackage(final List<Package> packages,
      final EMFIdGenerator idGenerator) {
      var references = packages.stream()
         .map(v -> {
            var label = String.format("<Package> %s", v.getName());
            return ElementReferencePropertyItem.Reference.builder()
               .elementId(idGenerator.getOrCreateId(v))
               .label(label)
               .name(v.getName()).build();
         })
         .collect(Collectors.toList());

      return references;
   }

}
