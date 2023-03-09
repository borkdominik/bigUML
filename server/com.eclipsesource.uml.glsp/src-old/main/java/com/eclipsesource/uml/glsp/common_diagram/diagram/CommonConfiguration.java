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
package com.eclipsesource.uml.glsp.uml.diagram.common_diagram.diagram;

public class CommonConfiguration { /*-
 implements DiagramConfiguration {

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      return Lists.newArrayList(
         createDefaultEdgeTypeHint(CommonTypes.COMMENT_EDGE));
   }

   public EdgeTypeHint createDefaultEdgeTypeHint(final String elementId) {
      List<String> allowed;

      ArrayList<String> from;
      ArrayList<String> to;

      switch (elementId) {
         // COMMENT
         case CommonTypes.COMMENT_EDGE:
            allowed = Lists.newArrayList();
            allowed.addAll(CommonTypes.LINKS_TO_COMMENT);
            return new EdgeTypeHint(elementId, true, true, true, List.of(CommonTypes.COMMENT),
               allowed);
         default:
            break;
      }
      return new EdgeTypeHint(elementId, true, true, true, List.of(), List.of());
   }

   @Override
   public List<String> getGraphContainableElements() { return List.of(CommonTypes.COMMENT); }

   @Override
   public List<ShapeTypeHint> getShapeTypeHints() {
      List<ShapeTypeHint> hints = new ArrayList<>();

      hints.add(new ShapeTypeHint(CommonTypes.COMMENT, true, true, false, false));

      return hints;
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      Map<String, EClass> mappings = DefaultTypes.getDefaultTypeMappings();

      mappings.put(CommonTypes.COMMENT, GraphPackage.Literals.GNODE);
      mappings.put(CommonTypes.COMMENT_EDGE, GraphPackage.Literals.GEDGE);

      return mappings;
   }
   */
}
