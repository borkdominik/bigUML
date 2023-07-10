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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.ShapeTypeHint;
import org.eclipse.uml2.uml.Operation;

import com.eclipsesource.uml.glsp.core.diagram.DiagramElementConfiguration;
import com.eclipsesource.uml.glsp.uml.utils.QualifiedUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class UmlClass_Operation {
   public static String typeId() {
      return QualifiedUtil.representationTypeId(Representation.CLASS, DefaultTypes.COMPARTMENT,
         Operation.class.getSimpleName());
   }

   public enum Property {
      NAME,
      IS_ABSTRACT,
      IS_STATIC,
      IS_QUERY,
      VISIBILITY_KIND,
      CONCURRENCY,
      OWNED_PARAMETERS,
      OWNED_PARAMETERS_INDEX;
   }

   public static class DiagramConfiguration implements DiagramElementConfiguration.Node {

      @Override
      public Map<String, EClass> getTypeMappings() { return Map.of(
         typeId(), GraphPackage.Literals.GCOMPARTMENT); }

      @Override
      public Set<String> getGraphContainableElements() { return Set.of(); }

      @Override
      public Set<ShapeTypeHint> getShapeTypeHints() {
         return Set.of(
            new ShapeTypeHint(typeId(), false, true, false, false,
               List.of(UmlClass_Parameter.typeId())));
      }
   }
}
