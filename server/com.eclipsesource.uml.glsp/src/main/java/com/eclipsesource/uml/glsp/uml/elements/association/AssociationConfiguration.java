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
package com.eclipsesource.uml.glsp.uml.elements.association;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.EdgeTypeHint;
import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.glsp.uml.configuration.RepresentationEdgeConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.class_.ClassConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.interface_.InterfaceConfiguration;
import com.eclipsesource.uml.glsp.uml.utils.QualifiedUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class AssociationConfiguration extends RepresentationEdgeConfiguration<Association> {
   @Inject
   public AssociationConfiguration(@Assisted final Representation representation) {
      super(representation);
   }

   public static class Variant {
      public static String compositionTypeId() {
         return QualifiedUtil.templateTypeId(DefaultTypes.EDGE, "composition",
            Association.class.getSimpleName());
      }

      public static String aggregationTypeId() {
         return QualifiedUtil.templateTypeId(DefaultTypes.EDGE, "aggregation",
            Association.class.getSimpleName());
      }
   }

   public enum Property {
      NAME,
      VISIBILITY_KIND
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      return Map.of(
         typeId(), GraphPackage.Literals.GEDGE,
         Variant.aggregationTypeId(), GraphPackage.Literals.GEDGE, // Required because the client shows a preview
                                                                   // version
         Variant.compositionTypeId(), GraphPackage.Literals.GEDGE);
   }

   @Override
   public Set<EdgeTypeHint> getEdgeTypeHints() {
      var hints = new HashSet<EdgeTypeHint>();

      hints.addAll(Set.of(
         new EdgeTypeHint(typeId(), true, true, true,
            List.of(ClassConfiguration.typeId(), InterfaceConfiguration.typeId()),
            List.of(ClassConfiguration.typeId(), InterfaceConfiguration.typeId())),
         new EdgeTypeHint(Variant.aggregationTypeId(), true, true, true, // Required because the client needs to
                                                                         // differentiate between the variants
            List.of(ClassConfiguration.typeId(), InterfaceConfiguration.typeId()),
            List.of(ClassConfiguration.typeId(), InterfaceConfiguration.typeId())),
         new EdgeTypeHint(Variant.compositionTypeId(), true, true, true,
            List.of(ClassConfiguration.typeId(), InterfaceConfiguration.typeId()),
            List.of(ClassConfiguration.typeId(), InterfaceConfiguration.typeId()))));

      var actor = tryConfigurationFor(Actor.class);
      var useCase = tryConfigurationFor(UseCase.class);

      if (actor.isPresent() && useCase.isPresent()) {
         hints.add(
            new EdgeTypeHint(typeId(), true, true, true,
               List.of(actor.get().typeId()),
               List.of(useCase.get().typeId())));
      }

      return hints;
   }
}
